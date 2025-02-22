import { Component } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'gifs-side-menu-header',
  imports: [],
  templateUrl: './side-menu-header.component.html',
  styles: ``
})
export class SideMenuHeaderComponent {

  //debemos configurar el tsconfig.json si queremos que la ruta de importacion salga asi resumido y no con '../../../../../'
  envs = environment;
}
