import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService, Department } from '../../services/department.service';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  departments: Department[] = [];
  productId: string | null;

  constructor(
    private fb: FormBuilder,
    private departmentService: DepartmentService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      code: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, Validators.required],
      status: [true, Validators.required],
      departmentId: ['', Validators.required]
    });

    this.productId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.departmentService.getDepartments().subscribe(departments => {
      this.departments = departments;
    });

    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe(product => {
        this.productForm.patchValue(product);
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;

      if (this.productId) {
        this.productService.updateProduct(this.productId, product).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.addProduct(product).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
    }
  }
}
