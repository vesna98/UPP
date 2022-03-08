import { Component, OnInit } from '@angular/core';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { HttpClient } from '@angular/common/http';
import { PaypalPaymentService } from '../paypal-payment.service';
import { ActivatedRoute } from '@angular/router';
import { take } from 'rxjs';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css']
})
export class StartScreenComponent implements OnInit {

   success=false;
  constructor(private http: HttpClient, public payPalService: PaypalPaymentService, private route: ActivatedRoute) { }
  public payPalConfig?: IPayPalConfig;

  ngOnInit(): void {
    this.success=false;
    this.route.queryParams.pipe(take(1)).subscribe((params:any) => {
      this.initConfig(params);
    });
    
  }

  private initConfig(params: any): void {
    this.payPalConfig = {
    currency: 'USD',
    clientId: 'ATc9Vu49WOz76dA92BLRP4b7W4wSfP5w6vNmwK2H0eySlGSONBiVqwLMdwqfHp7jqPuD6ASMT7jT4wEk',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: params['value'],
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: params['value'],
              }
            }
          },
          items: [
            {
              name: params['name'],
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'USD',
                value: params['value'],
              },
            },
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details:any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      //this.showSuccess = true;
      this.payPalService.UploadPayPalData(data).subscribe(res=>{
        console.log('////////')
        console.log(res);
        console.log('//////')
      })
      this.success=true;
      //window.location.href = this.querryStringBuilder();
     
      alert('Succesful payment!')
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
      this.success=false;
     // window.location.href = this.querryStringBuilder();
      alert('Payment was cancled.')
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }

  querryStringBuilder(): string {
    let temp: string = "http://localhost:53135/shop/procurement";
    temp+= "?name=" + this.success;
    
    return temp;
  }

  //pokusaj gadjanja kontrolera
  pokusaj(){
    console.log('pozvano')
    
    this.http.get<any>('http://localhost:18041/api/Paypal/pokusaj').subscribe(data => {
      //this.totalAngularPackages = data.total;
      console.log('AAA')
  }) 
    console.log('gotovo')
  }

  goToUrl(){
    window.location.href = 'http://localhost:8080/bonita/apps/userAppBonita/task-list/?_l=en';
  }
}
