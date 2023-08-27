import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  constructor(private storage: AngularFireStorage, private afs:AngularFirestore, private toastr:ToastrService, private router: Router) { }

  uploadImage(selectedImage:any,postData:any,formStatus:any,id:any){
    const filePath = `postIMG/${Date.now()}`;
    console.log(filePath);

    if(selectedImage){
      this.storage.upload(filePath,selectedImage).then(()=>{
        console.log("Post image uploaded successfully!");
  
        this.storage.ref(filePath).getDownloadURL().subscribe(URL=>{
          postData.postImgPath = URL;
  
          if(formStatus==='Edit'){
            this.updateData(id,postData);
          }else{
            this.saveData(postData);
          }
        })
      })
    }else{
      console.log(postData)
      if(formStatus==='Edit'){
        this.updateData(id,postData);
      }else{
        this.saveData(postData);
      }
    }
  }

  saveData(postData:any){
    this.afs.collection('posts').add(postData).then(docRef => {
      this.toastr.success('Data insert successfully');

      this.router.navigate(['/posts']);
    })
  }

  loadData(){
    return this.afs.collection('posts').snapshotChanges().pipe(map(actions => {
      return actions.map(a=>{
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return {id,data}
      })
    }));
  }

  loadOneData(id:any){
    return this.afs.doc(`posts/${id}`).valueChanges();
  }

  updateData(id:any,postData:any){
    this.afs.doc(`posts/${id}`).update(postData).then(()=>{
      this.toastr.success('Data update successfullly!');
      this.router.navigate(['/posts']);
    })
  }
}
