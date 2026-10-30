import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { employeeListDTO } from 'src/app/app-models/employee-list-dto';

@Injectable({
  providedIn: 'root'
})
export class EmployeeListService {

  private baseURL = "http://localhost:8080/api/v1/employees";
  constructor(private http:HttpClient) { }


  getEmployeesList():Observable<employeeListDTO[]>{
    return this.http.get<employeeListDTO[]>(this.baseURL);
  }

  createEmployee(employee:employeeListDTO):Observable<object>{
    return this.http.post(`${this.baseURL}`, employee)
  }
}
