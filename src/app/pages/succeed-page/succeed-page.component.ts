import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AffiliateService } from 'src/app/services/affiliate/affiliate.service';

@Component({
  selector: 'app-succeed-page',
  templateUrl: './succeed-page.component.html',
  styleUrls: ['./succeed-page.component.scss']
})
export class SucceedPageComponent implements OnInit {

  public cdpId: string;

  constructor(
    public readonly activatedRoute: ActivatedRoute,
    public readonly affiliateService: AffiliateService)
  { }

  ngOnInit() {
    this.cdpId = this.activatedRoute.snapshot.paramMap.get('cdpId');
  }

}
