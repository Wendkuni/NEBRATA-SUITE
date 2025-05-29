import {Pipe, PipeTransform} from '@angular/core';
import { environment } from 'environments/environment';
import { Genre } from '@sycadApp/models/data-references/system/model';





@Pipe({name: 'generalDownload'})
export class GenralDownloadPipe implements PipeTransform {
  transform(name:string):string {
    return environment.APPLICATION.AVATAR_API+'/' + name;
  }
}


@Pipe({name: 'avatarUser'})
export class AvatarUserPipe implements PipeTransform {
  transform(userOnline:{ avatar: string,genre:Genre}):string {


    if(userOnline?.avatar) {
      if(userOnline.avatar.startsWith("http")){
        return userOnline.avatar;
      }else{
        return environment.APPLICATION.AVATAR_API+'/' + userOnline.avatar;
      }
    }

    if(userOnline?.genre==Genre.FEMME) {
      return '/assets/img/avatars/femme.webp';
    }
    if(userOnline?.genre==Genre.HOMME) {
      return '/assets/img/avatars/homme.webp';
    }


    return '/assets/img/avatars/default-user.webp';
  }
}
@Pipe({name: 'avatarLogo'})
export class AvatarLogoPipe implements PipeTransform {
  transform(userOnline:{ avatar}):string {
    if(userOnline.avatar) {
      if(userOnline.avatar.startsWith("http")){
        return userOnline.avatar;
      }else{
        return environment.APPLICATION.AVATAR_API+'/' + userOnline.avatar;
      }
    }
    else{
      return '/assets/img/avatars/logo-dgi.webp'
    }
  }
}

@Pipe({name: 'acteurLogo'})
export class ActeurLogoPipe implements PipeTransform {
  transform(userOnline:{ avatar}):string {
    if(userOnline.avatar) {
      if(userOnline.avatar.startsWith("http")){
        return userOnline.avatar;
      }else{
        return environment.APPLICATION.AVATAR_API+'/' + userOnline.avatar;
      }
    }
    else{
      return '/assets/img/avatars/actor.webp'
    }
  }
}


