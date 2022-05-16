import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as _ from 'lodash';
import { AppConfigService } from 'src/config/config.service';

@Injectable()
export class ArgosService {
  // main account
  public ApiKey = this.config.argosApikey;
  public AccessKey = this.config.argosAccessKey;

  //lint invalid
  constructor(private readonly config: AppConfigService) {}

  public BASE_URL = 'https://api2.argos-solutions.io'; // https://api.argos-solutions.io /api/v1/exchangeInfo
  private makeAxiosOptions(method: string, path: string, params?: object) {
    const options = {
      url: `${this.BASE_URL}${path}`,
      data: method !== 'GET' ? params : undefined,
      method: method,
      headers: {
        // 'Content-type': 'application/x-www-form-urlencoded',
        'x-api-key': this.ApiKey,
        // 'access-key': this.AccessKey
      },
    };
    // console.log(options);
    return options;
  }
  public async getKycState(email: string) {
    // https://api2.argos-solutions.io/f1/submissions?email={email}&submission_id={submission id}
    // `/v2/submissions/${email}`
    const options = this.makeAxiosOptions(
      'GET',
      `/f1/submissions?email=${email}`,
    );
    let resultKyc = null;
    try {
      const result = await axios(options as any);

      const data = result.data;
      // console.log(JSON.stringify(data, null, 2));
      if (data) {
        let items = data.Items;
        if (items && items.length > 0) {
          if (items.length === 1) {
            const item = items[0];
            resultKyc = item;
          } else {
            // approved, pending, rejected
            items = _.sortBy(items, function (o) {
              return o.kyc.result;
            });
            const item = items[0];
            resultKyc = item;
          }
        }
      }
      /*
      https://docs.argos-solutions.io/ko/api/get.html#get-%EC%BF%BC%EB%A6%AC-%ED%8A%B9%EC%A0%95-%EC%A1%B0%EA%B1%B4%EC%9C%BC%EB%A1%9C-%EC%BF%BC%EB%A6%AC%ED%95%98%EA%B8%B0
      {
        "Items": [
          {
            "data": {
              "first_name": "test",
              "last_name": "test",
              "gender": "male",
              "nationality": "United States, USA",
              "date_of_birth": "2020-07-02",
              "address_city": "Pittsburgh",
              "address_country": "United States, USA",
              "address_state": "PA",
              "address_street": "5000 Forbes Ave",
              "address_zipcode": "15213"
            },
            "email": "john@gmail.com",
            "submission_id": "19lwz38kczv2mnw",
            "created_at": "2020-07-24 06:46",
            "userid": "your_user_id",
            "kyc": {
              "result": "pending"
            }
          }
        ]
      }*/
      // console.log(result.data);
    } catch (e) {
      console.error(e);
      // data = e;
    }
    return resultKyc;
  }

  public async getProductionKycState(email: string) {
    // https://api2.argos-solutions.io/f1/submissions?email={email}&submission_id={submission id}
    // `/v2/submissions/${email}`
    // let options = this.makeAxiosOptions('GET', `/f1/submissions/${email}`)

    let path = `/f1/submissions`;
    if (email) {
      path += `?email=${email}`;
    }
    const method = 'GET';
    const params = null;
    const options = {
      url: `${this.BASE_URL}${path}`,
      data: method !== 'GET' ? params : undefined,
      method: method,
      headers: {
        // 'Content-type': 'application/x-www-form-urlencoded',
        'x-api-key': this.config.argosProdApikey,
        // 'access-key': this.AccessKey
      },
    };
    const resultKyc = null;
    try {
      const result = await axios(options as any);

      const data = result.data;
      console.log(JSON.stringify(data, null, 2));
      // if(data){
      //   let items = data.Items;
      //   if(items && items.length > 0){
      //     if(items.length === 1){
      //       const item = items[0]
      //       resultKyc = item
      //     }else{
      //       // approved, pending, rejected
      //       items =  _.sortBy(items, function(o) { return o.kyc.result; });
      //       const item = items[0]
      //       resultKyc = item
      //     }
      //   }
      // }
      return data.Items;

      // console.log(result.data);
    } catch (e) {
      console.log(e);
      // data = e;
    }
    return resultKyc;
  }
}
