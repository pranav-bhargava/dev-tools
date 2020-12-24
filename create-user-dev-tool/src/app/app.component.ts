import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  public userCount: number;
    apiCollection: Array<any> = [
        {
            name: 'Thor',
            environment: 'thor'
        },
        {
            name: 'QA',
            environment: 'qa'
        }
    ];
    public goButtonDisabled : boolean = true;
    public selectedAPI: number = -1; 
    public selectedApiFromDropdown: string;
    public responseJson: any;
    public showLoader: boolean = false;

    constructor(
        private http: HttpClient,
    ) { }

    ngOnInit() {
        // this.loaderService.hideLoader();
    }

    selectAPI(index: number) {
        this.selectedAPI = index;
        this.selectedApiFromDropdown = this.apiCollection[index].name;
        this.setGoButtonState();
    }

    createParams(selectedAPI): any {
        return {
            environment: this.apiCollection[selectedAPI].environment,
            count: this.userCount ? this.userCount : 1
        }
    }

    callAPI() {
        const params = this.createParams(this.selectedAPI);
        this.showLoader = true;
        this.goButtonDisabled = true;
        let url = '/create-user';
        this.http.get(url, {params: params}).subscribe((res: any)=> {
            this.responseJson = res;
            this.showLoader = false;
            this.goButtonDisabled = false;
        }, (err)=> {
            this.goButtonDisabled = false;
            this.showLoader = false;
        })
    }

    setGoButtonState() {
        if(this.userCount > 5) {
            this.goButtonDisabled = true;
            return;
        }
        this.goButtonDisabled = this.selectedAPI > -1 ? false : true;
    }
}
