import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentHistory } from './document-history';

describe('DocumentHistory', () => {
  let component: DocumentHistory;
  let fixture: ComponentFixture<DocumentHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
