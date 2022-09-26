import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TweetService } from 'src/app/service/tweet.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-view-tweet',
  templateUrl: './view-tweet.component.html',
  styleUrls: ['./view-tweet.component.scss']
})
export class ViewTweetComponent implements OnInit {

  tweetEditForm = this._lf.group({
    message: ['']
    
  });

  displayError = false;
  displayLoading = false;
  isShowEditSuccess = false;
  fetchDone =false;

  public tweets : any[]=[];
  public replies : any[]=[];
  public msg : any;
  public tag : any;
  tweetService: TweetService;
  userservice: UserService

  constructor(public _tweetService: TweetService, private _lf: FormBuilder, public _userservice: UserService) {
    this.tweetService =_tweetService;
    this.userservice=_userservice;
   }


   PostUpdated(){
    this.isShowEditSuccess = false;
  }

   reloadTweet(){
    if (localStorage.getItem('JwtToken') != null) {
      this.tweetService.MyTweets().subscribe(
        (result) =>{
          this.tweets = result;
          this._userservice.updateIsReloadTweet(false);
        },
        (error)=>{
          alert('Error while loading!! Please Check Network');
        }
      )
    }
   }

   tweetLike(tid:string, isLike: boolean, i: number){
    this._tweetService.tweetLike(tid, isLike).subscribe(      
      (result:any) => {
        this.tweets[i].likedByLoggedUser = isLike;
      },
      (err: any) => {
        alert(err.error.error.description);
      }
    )
   }

   tweetDelete(tid:string, i: number){
    this._tweetService.tweetDelete(tid).subscribe(      
      (result:any) => {
        this.tweets.splice(i, 1);;
      },
      (err: any) => {
        alert(err.error.error.description);
      }
    )
   }

   openEdit(i: number){

    var isOn = this.tweets[i].uiEDisplay;

    this.tweets.forEach((element: { uiEDisplay: boolean; }) => {
      element.uiEDisplay = false;
    });
    this.msg = this.tweets[i].message;
    this.tag = this.tweets[i].tag;
    this.tweets[i].uiEDisplay=!isOn;
   }

   openReply(i : number){
     
    this.tweets[i].uiEDisplay=false;
    var isOn = this.tweets[i].uiRDisplay;
    this.replies = [];

    this.tweets.forEach((element: { uiRDisplay: boolean; }) => {
      element.uiRDisplay = false;
    });

    this.tweets[i].uiRDisplay=!isOn;
    
    
   }

   replyMsg(replymsg : any, tId: string,i:number){
    this.displayLoading = true;

    this._tweetService
    .tweetReply(tId, replymsg).subscribe(
      (result:any) => {
        //alert('tweet replied');
        this.reloadTweet();
        this.openReply(i);
        this.displayLoading=false;        
      },
      (err: any) => {
        this.displayLoading = false;
        alert(err.error.error.description);
      }
    );
   }
  Update(tId : string, i: number) {
    this.displayLoading = true;

    this._tweetService
      .updateTweet(tId, this.tweetEditForm.value.message).subscribe(
        (result:any) => {
          this.displayLoading = false;
          this.isShowEditSuccess = true;
          this.tweets[i].message = this.tweetEditForm.value.message; 
          this.openEdit(i);         
        },
        (err: any) => {
          this.displayError = true;
          this.displayLoading = false;
          alert(err.error.error.description);
        }
      );
   }
 

  ngOnInit(): void {
    
    this.tweetService.MyTweets().subscribe(
      (result) =>{
        this.tweets = result;
        this.fetchDone = true
      },
      (error)=>{
        alert('Error while loading!! Please Check Network');
      }
    )

    this.tweetEditForm.valueChanges.subscribe((value) => {
      this.displayError = false;
      this.isShowEditSuccess =false;
    });

  }

}
