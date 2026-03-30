import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { Character } from '../../models/character.model';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-character-card',
  imports: [RouterLink, StatusBadgeComponent],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css',
})
export class CharacterCardComponent {
  readonly character = input.required<Character>();

  readonly routes = APP_ROUTES;

  readonly registryId = computed(() => `PX-${String(this.character().id).padStart(4, '0')}`);
  readonly profileTag = computed(() => (this.character().type || this.character().gender).trim());
}
