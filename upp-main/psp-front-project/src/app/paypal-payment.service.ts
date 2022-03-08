import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClientAuthorizeCallbackData } from 'ngx-paypal';

@Injectable({
  providedIn: 'root'
})
export class PaypalPaymentService {

  readonly BaseURI="http://localhost:18041/api";

  constructor(private http:HttpClient) { }
UploadPayPalData(data:IClientAuthorizeCallbackData){
  console.log('c------------')
  console.log(data.create_time)
  var res={
    CreatedTime:data.create_time,
    Ppid:data.id,
    Intend:data.intent as string,
    PayerAdress:data.payer.address?.address_line_1+"|"+data.payer.address?.admin_area_2+"|"+data.payer.address?.admin_area_1+"|"+data.payer.address?.country_code+"|"+data.payer.address?.postal_code,
    PayerName:data.payer.name?.given_name+" "+data.payer.name?.surname,
    PayerId:data.payer.payer_id,
    Phone:data.payer.phone?.phone_number?.national_number as string,
    Status:data.status as string,
    UpdateTime:data.update_time,
    //nizove namestiti
  
    PurchaseUnitData:data.purchase_units,
   
  }

  var jsonobj=JSON.stringify(res);
  console.log(jsonobj)
  console.log('j----')
  let apiUri=this.BaseURI+'/PayPal/PayPalPayment';
  let params = new HttpParams();
        params = params.set('jsonobj', jsonobj);
    
    return this.http.post(apiUri, params);
}

  payWithPayPal(info: IClientAuthorizeCallbackData){
    /*console.log("pozove placanje pp")
    console.log("info---")
    console.log(info)
    console.log('****')
    let apiUri=this.BaseURI+'/PayPal/PayPalPayment';
    let params = new HttpParams();
        params = params.set('paymentInfo', info as any);
    return this.http.post(apiUri,params);
  }*/
}

}
