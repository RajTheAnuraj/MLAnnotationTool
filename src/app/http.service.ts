import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class HttpService {
  constructor(private http: HttpClient) { }

  PostRequest(url:string, params:any){
      console.log(url,params);
    return this.http.post(url, params);
  }
}