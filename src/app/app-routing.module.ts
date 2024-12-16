import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'splashscreen',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then(m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'splashscreen',
    loadChildren: () => import('./pages/splashscreen/splashscreen.module').then(m => m.SplashscreenPageModule)
  },
  {
    path: 'pasajero',
    loadChildren: () => import('./pages/pasajero/pasajero.module').then(m => m.PasajeroPageModule)
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./pages/admin/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'home-chofer',
    loadChildren: () => import('./pages/home-chofer/home-chofer.module').then(m => m.HomeChoferPageModule)
  },
  
  {
    path: 'restablecer',
    loadChildren: () => import('./pages/restablecer/restablecer.module').then(m => m.RestablecerPageModule)
  },

  
  {
    path: 'home-cliente',
    loadChildren: () => import('./pages/home-cliente/home-cliente.module').then(m => m.HomeClientePageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: 'editar-user/:uid',
    loadChildren: () => import('./pages/editar-user/editar-user.module').then(m => m.EditarUserPageModule)
  },
  {
    path: 'mapa',
    loadChildren: () => import('./pages/mapa/mapa.module').then(m => m.MapaPageModule)
  },
  {
    path: 'viaje-creado/:uid',
    loadChildren: () => import('./pages/viaje-creado/viaje-creado.module').then(m => m.ViajeCreadoPageModule)
  },
  {
    path: 'miperfil',
    loadChildren: () => import('./pages/miperfil/miperfil.module').then(m => m.MiperfilPageModule)
  },
  {
    path: 'home-admin',
    loadChildren: () => import('./pages/home-admin/home-admin.module').then( m => m.HomeAdminPageModule)
  },
  {
    path: 'editar-viajes/:uid',
    loadChildren: () => import('./pages/editar-viajes/editar-viajes.module').then( m => m.EditarViajesPageModule)
  },
  {
    path: 'ver-viajes',
    loadChildren: () => import('./pages/ver-viajes/ver-viajes.module').then( m => m.VerViajesPageModule)
  },
  {
    path: 'codigoqr/:uid',
    loadChildren: () => import('./pages/codigoqr/codigoqr.module').then( m => m.CodigoqrPageModule)
  },
  {
    path: 'detalle-viaje/:uid',
    loadChildren: () => import('./pages/detalle-viaje/detalle-viaje.module').then( m => m.DetalleViajePageModule)
  },
  {
    path: 'camaraqr',
    loadChildren: () => import('./pages/camaraqr/camaraqr.module').then( m => m.CamaraqrPageModule)
  },
  {
    path: 'viaje-en-curso/:uid',
    loadChildren: () => import('./pages/viaje-en-curso/viaje-en-curso.module').then( m => m.ViajeEnCursoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}