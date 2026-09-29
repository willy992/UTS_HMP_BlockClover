import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular/lazy';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private readonly alertController: AlertController) {}

  async simulateLogout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Logout simulasi',
      message:
        'Logout berhasil disimulasikan. Tidak ada akun, sesi, atau data yang dihapus.',
      buttons: ['OK'],
    });

    await alert.present();
  }
}
