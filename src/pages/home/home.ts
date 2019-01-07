import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import {stringify} from 'qs';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  path: String = "";
  token: String = 'b83adafd188e87e09dbe2a0c2e7837a5';
  fileTransfer: FileTransferObject = this.transfer.create();


  constructor(public navCtrl: NavController, public navParams: NavParams,private camera: Camera,private transfer: FileTransfer, private file: File) {

  }

  /**
   * 打开摄像头
   */
  openCamera() {
    const options: CameraOptions = {
      quality: 90,                                                   //相片质量 0 -100
      destinationType: this.camera.DestinationType.DATA_URL,        //DATA_URL 是 base64   FILE_URL 是文件路径
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,                                       //是否保存到相册
      // sourceType: this.camera.PictureSourceType.CAMERA ,         //是打开相机拍照还是打开相册选择  PHOTOLIBRARY : 相册选择, CAMERA : 拍照,
    }

    this.camera.getPicture(options).then((imageData) => {
      console.log("got file: " + imageData);

      // If it's base64:
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      this.path = base64Image;
      alert(this.path);

      //If it's file URI
      // this.path = imageData;

      this.upload(this.path);

    }, (err) => {
      // Handle error
    });
  }


    /**
   * 文件上传
   */
  upload(url){
    const apiPath = "http://192.168.0.104:9090/api/commons/attach?" + stringify({token: this.token});
    let options: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'name.jpg',   //文件名称
      headers: {},
      // 如果要传参数，写这里
      params: {
        maxSize: 5000000,
        modularName: 'CNL',
        allowType: 'jpg;png;pdf;doc;xls;xlsx;docx',
      }
    };

    this.fileTransfer.upload(url, apiPath, options)
      .then((data) => {
        console.log(data);

      }, (err) => {
        console.log(err);
      });
  }


}
