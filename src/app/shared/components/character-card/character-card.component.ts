import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { Character } from '../../models/character.model';

@Component({
  selector: 'app-character-card',
  imports: [RouterLink],
  templateUrl: './character-card.component.html',
  styleUrl: './character-card.component.css',
})
export class CharacterCardComponent {
  readonly character = input.required<Character>();

  readonly routes = APP_ROUTES;

  readonly registryId = computed(() => `PX-${String(this.character().id).padStart(4, '0')}`);
  readonly profileTag = computed(() => (this.character().type || this.character().gender).trim());
  readonly statusLabel = computed(() =>
    this.character().status === 'unknown' ? 'Unknown' : this.character().status,
  );
}
