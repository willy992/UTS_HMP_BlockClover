import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false,
})
export class SettingsPage implements OnInit {
  private readonly darkModeStorageKey = 'simobile-dark-mode';

  isDarkMode = false;

  ngOnInit(): void {
    this.isDarkMode = localStorage.getItem(this.darkModeStorageKey) === 'true';

    this.applyTheme();
  }

  setDarkMode(enabled: boolean): void {
    this.isDarkMode = enabled;

    localStorage.setItem(this.darkModeStorageKey, String(enabled));

    this.applyTheme();
  }

  private applyTheme(): void {
    document.documentElement.classList.toggle(
      'ion-palette-dark',
      this.isDarkMode,
    );
  }
}
