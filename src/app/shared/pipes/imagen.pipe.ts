import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "imagen",
})
export class ImagenPipe implements PipeTransform {
  transform(img: string, tipo: string): any {
    let url = "http://127.0.0.1:8000/api/imagenUsuario/";
    if(img==null){
      img='images_default.jpg'
    }
    switch (tipo) {
      case "ROLE_USER":
        url+=img;
        break;
      case "ROLE_DOCTOR":
        url+=img;
        break;
        default:
        url+='images_default.jpg';
        break;
    }
    return url;
  }
}
