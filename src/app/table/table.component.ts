import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  products: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.readCsvData();
  }

  readCsvData() {
    this.http.get('assets/prices.csv', { responseType: 'text' })
      .subscribe(data => {
        const rows = data.split('\n');
        for (let i = 0; i < rows.length; i++) {
          const columns = rows[i].split(',');
          this.products.push(columns);
        }
      });
  }
}
