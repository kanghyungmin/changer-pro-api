import * as crypto from 'crypto';
import * as mongoose from 'mongoose';

import { EmailNotiType, INoti } from './iNoti';
import * as contents from './genContents';

import { Withdraw } from '../../../entities/withdraw.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import sendgridIns = require('@sendgrid/mail');
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class EmailNotiService implements INoti {
  private msg = {
    // to: ['onlyhm922@gmail.com'],
    to: [],
    from: {
      email: this.config.noReply,
      name: 'Changer',
    },
    subject: '',
    // text: 'and easy to do anywhere, even with Node.js',
    html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  };
  public SECRET: string = this.config.secret || '';

  constructor(
    @InjectModel(Withdraw.name)
    private readonly withdrawModel: Model<Withdraw>,
    private readonly config: AppConfigService,
  ) {
    sendgridIns.setApiKey(this.config.sendgridApikey);
  }

  public send(type: EmailNotiType, data: any): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        switch (type) {
          case EmailNotiType.WITHDRAW_REQUEST:
            await this.sendWithDrawalRequest(this._getRecipient(), data);
            this.msg.to.pop();
            break;
          case EmailNotiType.DEPTRATIO_ALARM:
            await this.sendDeptAlarm(this._getRecipient(), data);
            break;
          case EmailNotiType.LIQUIDATION_DONE:
            await this.sendLiquidataionDone(this._getRecipient(), data);
            break;
          case EmailNotiType.SETTLEMENT_DONE:
            await this.sendSettlementDone(this._getRecipient(), data);
            break;
          case EmailNotiType.LIQUIDATION_PREALARM:
            await this.sendPreLiquidationAlarm(this._getRecipient(), data);
            break;
          case EmailNotiType.WITHDARW:
            await this.sendWithDraw(this._getRecipient(), data);
            this.msg.to.pop();
            break;
          case EmailNotiType.VERIFY_SIGN_UP:
            await this.sendVerifyForRegister(data);
            break;
          case EmailNotiType.SIGN_UP:
            await this.signup(data);
            break;
          case EmailNotiType.ENABLE_OTP:
            await this.sendEnableOtp(data);
            break;
          case EmailNotiType.DISENABLE_OTP:
            await this.sendDisableOtp(data);
            break;
          case EmailNotiType.CHANGE_PW:
            await this.sendChangePW(data);
            break;
          case EmailNotiType.FIND_PW:
            await this.sendFindPW(data);
            break;
          case EmailNotiType.DEPOSIT:
            await this.snedDeposit(data);
            break;
          case EmailNotiType.DIFF_IP:
            await this.sendDiffIP(data);
            break;
        }
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
  private async sendWithDraw(emails: string[], data: any = {}) {
    data.amount = data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Action Required: Settlement Imminent');
    else this.setSubject('DEV--[Changer] Action Required: Settlement Imminent');
    this.setRecipient(data.email);

    this.setContents(contents.getEmailWithDraw(emails, data));
    await sendgridIns.sendMultiple(this.msg as any);
  }
  private makePreAlarmTable(data: any): string {
    const defatulHtml = `<table border="1" width=550 style="border-collapse:collapse;">
                                    <tr align ="center" style="display:table-row">
                                    <th colspan="4" border="0" align="center">
                                        The following currencies to be liquidated
                                    </th>
                                    </tr>
                                    <tr>
                                    <td width="300" align="center"> Currency </td>
                                    <td width="250" align="center"> Asset </td>
                                    </tr>`;
    let contents: string = defatulHtml;
    for (let idx = 0; idx < data.currencies.length; idx++) {
      contents =
        `${contents}` +
        `<tr>
                            <td align="center"> ${data.currencies[idx]} </td>
                            <td align="center"> ${data.balances[idx]} </td>
                        </tr>`;
    }
    contents = contents + `</table>`;

    return contents;
  }
  private async sendPreLiquidationAlarm(emails: string[], data: any) {
    // const tableContents = this.makePreAlarmTable(data)
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Action Required: Settlement Imminent');
    else this.setSubject('DEV--[Changer] Action Required: Settlement Imminent');
    this.setRecipient(data.email);
    this.setContents(contents.getEmailPreLiquidationAlarm(emails, data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  private async sendDeptAlarm(emails: string[], data: any = {}) {
    data.acountValue = data.acountValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    data.maxCredit = data.maxCredit
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    data.creditUsed = data.creditUsed
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Over Leveraged Notice');
    else this.setSubject('DEV--[Changer] Over Leveraged Notice');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getEmailDeptAlarm(emails, data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  private async sendLiquidataionDone(emails: string[], data: any = {}) {
    data.acountValue = data.acountValue
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    data.maxCredit = data.maxCredit
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    data.creditUsed = data.creditUsed
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Liquidation processed');
    else this.setSubject('DEV--[Changer] Liquidation processed');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getEmailLiquidationDone(emails, data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  private async sendSettlementDone(emails: string[], data: any = {}) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Settlement Processed');
    else this.setSubject('DEV--[Changer] Settlement Processed');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getEmailSettlementDone(emails, data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  private async sendWithDrawalRequest(emails: string[], data: any = {}) {
    const recipient = process.env.OPERATOR_EMAIL;

    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Withdrawal Submitted');
    else this.setSubject('DEV--[Changer] Withdrawal Submitted');

    this.setRecipient(recipient);

    //시스템 운영자.
    this.setContents(contents.getEmailWithdrawlReqToAdmin(emails, data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();

    //고객
    this.msg.to.push(data.requester);
    this.setContents(contents.getEmailWithdrawlReqToCustomer(emails, data));
    await sendgridIns.sendMultiple(this.msg as any);
  }
  public setSubject(subject: string) {
    this.msg.subject = subject;
  }
  public setRecipient(toEmail: string) {
    this.msg.to.push(toEmail);
  }
  private _getRecipient(): string[] {
    return this.msg.to as string[];
  }
  public setContents(contents: string) {
    this.msg.html = contents;
  }
  public async getWithdrawalInfo(id: string) {
    let result;
    const aggregateStmts = [
      {
        $lookup: {
          from: 'accounts',
          localField: 'account',
          foreignField: '_id',
          as: 'accountInfo',
        },
      },
      {
        $lookup: {
          from: 'currencies',
          localField: 'currency',
          foreignField: '_id',
          as: 'currencyInfo',
        },
      },
      {
        $project: {
          _id: 1,
          email: '$accountInfo.email',
          currency: '$currencyInfo.fullName',
          amount: '$amount',
        },
      },
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
    ];

    try {
      // result = await this.withdrawModel.aggregate(aggregateStmts).match({
      //   _id: id,
      // });

      result = await this.withdrawModel.aggregate(aggregateStmts);

      return {
        email: result[0].email[0] as string,
        currency: result[0].currency[0] as string,
        amount: result[0].amount,
      };
    } catch (e) {
      console.log(e);
    }
  }
  // public

  public async signup(data: any = {}) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Activation Complete');
    else this.setSubject('DEV--[Changer] Activation Complete');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getSignUp(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
    // this.setRecipient()
  }
  async sendVerifyForRegister(data: any = {}) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Account Verification');
    else this.setSubject('DEV--[Changer] Account Verification');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getVerifyForRegister(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  async sendEnableOtp(data: any = {}) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] 2FA OTP Enabled');
    else this.setSubject('DEV--[Changer] 2FA OTP Enabled');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getEableOtp(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  async sendDisableOtp(data: any = {}) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] 2FA OTP Disabled');
    else this.setSubject('DEV--[Changer] 2FA OTP Disabled');
    this.setRecipient(data.toEmail);
    this.setContents(contents.getDisableOtp(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  async sendChangePW(data: any = {}) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Password Changed');
    else this.setSubject('DEV--[Changer] Password Changed');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getChangePW(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  async sendFindPW(data: any) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Password Change Verification');
    else this.setSubject('DEV--[Changer] Password Change Verification');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getFindPW(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  async sendDiffIP(data: any) {
    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Login Attempted from New IP address');
    else this.setSubject('DEV--[Changer] Login Attempted from New IP address');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getDiff(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  async snedDeposit(data: any) {
    // data.currency = data.currency.toUpperCase()
    data.amount = data.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (process.env.NODE_ENV !== 'prod')
      this.setSubject('[Changer] Deposit Confirmed');
    else this.setSubject('DEV--[Changer] Deposit Confirmed');

    this.setRecipient(data.toEmail);
    this.setContents(contents.getDeposit(data));
    await sendgridIns.sendMultiple(this.msg as any);
    this.msg.to.pop();
  }
  public createVerfiySixDigit() {
    const result = Math.floor(100000 + Math.random() * 900000);
    return result.toString();
  }

  async decryptVerifyKey(text: string) {
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      this.config.secret,
      this.config.iv,
    );
    const decrypted = decipher.update(text, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
  }
  createVerifyKey(email: string) {
    const msg = `${new Date().getTime()}&&${email}`;
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      this.config.secret,
      this.config.iv,
    );
    let encrypted = cipher.update(msg, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }
}

// async function test() {
//     let emailIns = new EmailNoti()
//     let email = "hmkkang0922@daum.net"
//     let data:any = {
//         date : moment().utc().format("YYYY-MM-DD HH:mm:ss"),
//         requester : email,
//         currency : "ETH",
//         address : "0x62891e768A1d84C4704Eeb468C2ad6C5451046f0",
//         amount : "100000".replace(/\B(?=(\d{3})+(?!\d))/g, ",")
//     }
//     emailIns.setSubject("[Changer] Withdrawal Submitted")  //제목
//     emailIns.setRecipient("onlyhm922@gmail.com")  //수신자
//     await emailIns.send(EmailNotiType.WITHDRAW_REQUEST,data)

//     data = {
//         daytime : moment().utc().format('YYYY-MM-DD HH:mm:ss'),
//         acountValue: '8574.56',
//         maxCredit: '85745.63',
//         creditUsed: '67595.79',
//         deptRatio: '78.83'
//     }
//     emailIns.setSubject("[Changer] Over Leveraged Notice")  //제목
//     emailIns.setRecipient('hmkkang0922@daum.net')  //수신자
//     await emailIns.send(EmailNotiType.DEPTRATIO_ALARM,data)

//     data = {
//         daytime : moment().utc().format('YYYY-MM-DD HH:mm:ss'),
//         acountValue: '8574.56',
//         maxCredit: '85745.63',
//         creditUsed: '67595.79',
//     }
//     emailIns.setSubject("[Changer] Liquidation processed")  //제목
//     emailIns.setRecipient('hmkkang0922@daum.net')  //수신자
//     await emailIns.send(EmailNotiType.LIQUIDATION_DONE,data)

//     data  = {
//         daytime : moment().utc().format('YYYY-MM-DD HH:mm:ss'),
//     }

//     emailIns.setSubject("[Changer] Settlement Processed")
//     emailIns.setRecipient(email)  //수신자
//     await emailIns.send(EmailNotiType.SETTLEMENT_DONE,data)

//     data = {
//         email : email,
//         daytime : moment().utc().format('MMM DD HH:mm'),
//         day : moment().utc().format('MMM DD')
//     }
//     emailIns.setSubject("[Changer] Action Required: Liquidation Imminent")
//     emailIns.setRecipient(email)
//     await emailIns.send(EmailNotiType.LIQUIDATION_PREALARM,data)

//     data = {
//         email : "hmkkang0922",
//         currency : "Ethereum",
//         amount : "20000",
//         address : "0x62891e768A1d84C4704Eeb468C2ad6C5451046f0",
//         txid : "0x62891e768A1d84C4704Eeb468C2ad6C5451046f0",
//     }

//     emailIns.setSubject("[Changer] Withdrawal Completed ")  //제목
//     emailIns.setRecipient(email)  //수신자
//     await emailIns.send(EmailNotiType.WITHDARW,data)

//     data = {
//         toEmail : email,
//         time : moment().utc().format('YYYY-MM-DD HH:mm')
//     }
//     await emailIns.send(EmailNotiType.CHANGE_PW,data)

//     data = {
//         toEmail : email,
//         time : moment().utc().format('YYYY-MM-DD HH:mm')
//     }
//     await emailIns.send(EmailNotiType.ENABLE_OTP,data)

//     data = {
//         toEmail : email,
//         time : moment().utc().format('YYYY-MM-DD HH:mm')
//     }
//     await emailIns.send(EmailNotiType.DISENABLE_OTP,data)

//     data = {
//         toEmail : "hmkkang0922@daum.net",
//         time : moment().utc().format('YYYY-MM-DD HH:mm')
//     }
//     await emailIns.send(EmailNotiType.SIGN_UP,data)

//     data = {
//         toEmail : "hmkkang0922@daum.net",
//         verifyKey: '123546',
//     }
//     await emailIns.send(EmailNotiType.VERIFY_SIGN_UP,data)

//     data = {
//         toEmail : "hmkkang0922@daum.net",
//         code : "123456"
//         // time : moment().utc().format('YYYY-MM-DD HH:mm')
//     }
//     await emailIns.send(EmailNotiType.FIND_PW,data)

//     data  = {
//         toEmail : "hmkkang0922@daum.net",
//         amount : "100000.52",
//         currency : "ETHEREUM",
//       }
//     await emailIns.send(EmailNotiType.DEPOSIT,data)

//     data = {
//         toEmail : email,
//         time : moment.utc().format("YYYY-MM-DD HH:mm"),
//         accessIP : "123.571.12.1"
//       }
//     await emailIns.send(EmailNotiType.DIFF_IP,data)

//     // //경민님.
//     const emailAuth = new EmailAuth();new EmailAuth()
//     await emailAuth.sendEmailForVerifyCode(email, '123456');
// }

// test().then((res)=>console.log("성공"))
// console.log("done")
