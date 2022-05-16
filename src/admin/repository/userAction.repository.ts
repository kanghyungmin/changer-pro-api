import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ActionLog,
  ActionLogDocument,
} from '../common/entities/actionLog.entity';
import { AdminAccountDocument } from '../common/entities/admin.entity';

export class UserActionRepository {
  constructor(
    @InjectModel(ActionLog.name)
    private readonly actionLogModel: Model<ActionLog>,
  ) {}

  async writeLogToDB(
    user: AdminAccountDocument | null,
    content: string,
  ): Promise<boolean> {
    const log: ActionLogDocument = new this.actionLogModel({
      user,
      content: content,
    });
    await log.save();
    return true;
  }

  async getLogs(
    isAdmin: boolean,
    userEmail: string,
    start: number,
    length: number,
  ): Promise<ActionLogDocument[]> {
    const pipeline = [
      {
        $lookup: {
          from: 'adminaccounts',
          localField: 'user',
          foreignField: '_id',
          as: 'adminAccount',
        },
      },
      {
        $unwind: {
          path: '$adminAccount',
        },
      },
      {
        $match: {
          $expr: {
            $cond: {
              if: {
                $eq: [isAdmin, true],
              },
              then: {
                $in: ['$adminAccount.type', ['Admin', 'Viewer', 'Operator']],
              },
              else: {
                $and: [
                  {
                    $eq: ['$adminAccount.email', userEmail],
                  },
                  {
                    $in: ['$adminAccount.type', ['Operator', 'Viewer']],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $addFields: {
          id: '$_id',
          'adminAccount.id': '$adminAccount._id',
        },
      },
      {
        $unset: ['_id', 'adminAccount._id'],
      },
    ];

    const logs: ActionLogDocument[] = await this.actionLogModel
      .aggregate(pipeline)
      .sort({ createdAt: -1 })
      .skip(start)
      .limit(length);
    return logs;
  }

  async getLogCount(isAdmin: boolean, userEmail: string): Promise<number> {
    const pipeline = [
      {
        $lookup: {
          from: 'adminaccounts',
          localField: 'user',
          foreignField: '_id',
          as: 'adminAccount',
        },
      },
      {
        $unwind: {
          path: '$adminAccount',
        },
      },
      {
        $match: {
          $expr: {
            $cond: {
              if: {
                $eq: [isAdmin, true],
              },
              then: {
                $in: ['$adminAccount.type', ['Admin', 'Viewer', 'Operator']],
              },
              else: {
                $and: [
                  {
                    $eq: ['$adminAccount.email', userEmail],
                  },
                  {
                    $in: ['$adminAccount.type', ['Operator', 'Viewer']],
                  },
                ],
              },
            },
          },
        },
      },
      {
        $count: 'total',
      },
    ];
    const totalCount: number[] = await this.actionLogModel.aggregate(pipeline);
    return totalCount[0];
  }
}
