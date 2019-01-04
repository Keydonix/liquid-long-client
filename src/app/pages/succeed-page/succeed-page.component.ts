import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-succeed-page',
  templateUrl: './succeed-page.component.html',
  styleUrls: ['./succeed-page.component.scss']
})
export class SucceedPageComponent implements OnInit {

  public cdpId: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cdpId = this.activatedRoute.snapshot.paramMap.get('cdpId');
  }

}
