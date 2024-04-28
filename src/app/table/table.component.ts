import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { vendorImageMapping } from '../vendor-image-mapping';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent implements OnInit {
  products: string[][] = [];
  vendorImageMapping = vendorImageMapping;

  constructor(private http: HttpClient) { }
  
  ngOnInit() {
    this.readCsvData();
    this.visibleData();
    this.pageNumbers();
  }

  readCsvData() {
    this.http.get('assets/prices.csv', { responseType: 'text' })
      .subscribe(data => {
        const rows = data.split('\n');
        for (let i = 1; i < rows.length-1; i++) {
          const columns = rows[i].split(',');
          this.products.push(columns);
          this.updateDate = this.products[0][3];
        }
      });
  }

  updateDate: string = "";
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  filteredProducts: string[][] = this.products;
  pageSizes: Array<number> = [10, 25, 50]

  visibleData() {
    let startIndex = (this.currentPage - 1) * this.pageSize;
    let endIndex = startIndex + this.pageSize;
    return this.filteredProducts.slice(startIndex, endIndex);
  }
  
  nextPage() {
    this.currentPage = this.currentPage++;
    this.visibleData();
  }

  previousPage() {
    this.currentPage = this.currentPage--;
    this.visibleData();
  }

  changePage(pageNumber:number) {
    this.currentPage = pageNumber;
    this.visibleData();
  }

  pageNumbers() {
    this.totalPages = Math.ceil(this.products.length / this.pageSize);
    let pageNumArray = new Array(this.totalPages);
    return pageNumArray;
  }
  
  changePageSize(pageSize:any) {
    this.pageSize = pageSize;
    this.visibleData();
  }

  filterData(searchTerm:string) {
    this.filteredProducts = this.products.filter((item)=>{
      return Object.values(item).some((val: unknown) => {
        return typeof val === 'string' && val.toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
    this.visibleData();
  }
}
