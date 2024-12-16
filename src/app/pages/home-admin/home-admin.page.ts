import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/firebas/usuarios.service.spec';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {

  constructor( private authService : AuthService) { }

  ngOnInit() {
  }


  async logout(){
    await this.authService.logout();
  }
}
