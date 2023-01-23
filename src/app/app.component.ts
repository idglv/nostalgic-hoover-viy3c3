import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import './check';
import JSONataExpressionGenerator, {
  IFormCondition,
  ConditionOperator,
  ValueType,
  Do,
} from './JSONataExpressionGenerator';
import { FormFieldExtractor } from './FormFieldExtractor';
import data from './data';
import {
  IFormSchema,
  IFormSchemaCodeListOption,
  IFormSchemaNode,
} from './formStructureTypes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Form Logic';
  expressions: string[] = [];
  expression: string = '';

  logicFormData: {
    doOptions: string[];
    fields: IFormSchemaNode[];
    operators: string[];
    valueTypes: string[];
    valueOptions: Map<string, IFormSchemaCodeListOption[]>;
  } = {
    doOptions: Object.values(Do),
    fields: [],
    operators: Object.values(ConditionOperator),
    valueTypes: Object.values(ValueType),
    valueOptions: new Map(),
  };

  formLogic = this.fb.group({
    do: [''],
    target: [''],
    conditions: this.fb.array([this.newCondition()]),
    logicOperator: ['and'],
  });

  get conditions() {
    return this.formLogic.controls['conditions'] as FormArray;
  }

  deleteCondition(index: number) {
    this.conditions.removeAt(index);
  }

  addCondition() {
    const condition = this.newCondition();

    this.conditions.push(condition);
  }

  private newCondition() {
    return this.fb.group({
      condition: [''],
      operator: [''],
      valueType: [''],
      value: [''],
    });
  }

  constructor(private fb: FormBuilder) {
    const formFieldExtractor = new FormFieldExtractor(data as IFormSchema);
    this.logicFormData.fields = formFieldExtractor.getAllFields();
    this.logicFormData.valueOptions = formFieldExtractor.getFieldsOptions();
  }

  onSubmit() {
    const generator = new JSONataExpressionGenerator();

    const result = this.formLogic.value as IFormCondition;

    // set isPrimitive if there are no options for this condition
    result.conditions.forEach((condition) => {
      condition.isPrimitive = !this.logicFormData.valueOptions.has(
        condition.condition
      );
    });

    console.warn(this.formLogic.value);
    console.log(this.logicFormData);

    this.expression = generator.generateExpression(
      this.formLogic.value as IFormCondition
    );
    console.log(this.expression);
  }
}
