// @ts-nocheck
// fix ExprNode have wrong types

import {
  IFormCondition,
  ICondition,
  ValueType,
  ConditionOperator,
  Do,
  LogicOperator,
} from './JSONataExpressionGenerator';
import { ExprNode } from 'jsonata';

export default class JSONataASTParser {
  parseAST(ast: ExprNode): IFormCondition {
    const formCondition: IFormCondition = {
      do: Do.Show,
      target: '',
      conditions: [],
      logicOperator: LogicOperator.All,
    };

    this.traverseAST(ast, formCondition);

    return formCondition;
  }

  private traverseAST(ast: ExprNode, formCondition: IFormCondition) {
    switch (ast.type) {
      case 'binary':
        if (ast.value === 'and' || ast.value === 'or') {
          formCondition.logicOperator =
            ast.value === 'and' ? LogicOperator.All : LogicOperator.Any;
          this.traverseAST(ast.lhs, formCondition);
          this.traverseAST(ast.rhs, formCondition);
        } else {
          formCondition.conditions.push(this.parseCondition(ast));
        }
        break;
      case 'path':
        this.parsePath(ast, formCondition);
        break;
      default:
        throw new Error(`Unsupported AST node type: ${ast.type}`);
    }
  }

  private parseCondition(ast: ExprNode): ICondition {
    const operator = ast.value as ConditionOperator;
    const leftOperand = ast.lhs;
    const rightOperand = ast.rhs;

    if (!leftOperand || !rightOperand) {
      throw new Error('Invalid AST structure: Missing operands');
    }

    const condition: ICondition = {
      condition: '',
      operator: operator,
      valueType: ValueType.Other,
      value: '',
    };

    if (leftOperand.type === 'path') {
      condition.condition = this.parsePathToString(leftOperand);
    } else {
      throw new Error(`Unsupported left operand type: ${leftOperand.type}`);
    }

    switch (rightOperand.type) {
      case 'path':
        condition.value = this.parseValue(rightOperand) || '';
        condition.valueType = this.getValueType(rightOperand);
        break;
      case 'number':
      case 'string':
        condition.valueType = ValueType.Selected;
        condition.value = rightOperand.value;
        condition.isPrimitive = true;
        break;
      default:
        throw new Error(`Unsupported right operand type: ${rightOperand.type}`);
    }

    return condition;
  }

  private parsePath(ast: ExprNode, formCondition: IFormCondition) {
    const steps = ast.steps || [];

    if (steps.length > 0) {
      const targetStep = steps[steps.length - 1];

      switch (targetStep.type) {
        case 'literal':
          formCondition.target = targetStep.value || '';
          break;
        default:
          throw new Error(`Unsupported target step type: ${targetStep.type}`);
      }
    }
  }

  private parseValue(ast: ExprNode): string {
    // fix need to find way to remove [0] [1] [2]

    const values = ast.steps[1]?.value?.split('_');

    if (values[2]) {
      return '' + values[2];
    }
  }

  private parsePathToString(ast: ExprNode): string {
    const steps = ast.steps || [];

    return steps
      .filter((step) => step.type === 'name')
      .map((step) => {
        switch (step.type) {
          case 'name':
            return step.value || '';
          default:
            throw new Error(`Unsupported step type: ${step.type}`);
        }
      })
      .join('.');
  }

  private getValueType(ast: ExprNode): ValueType {
    const steps = ast.steps || [];

    if (steps[0]?.type === 'variable') {
      switch (steps[0].value) {
        case 'currentForm':
          return ValueType.Selected;
        case 'previousVisits':
          return ValueType.Previous;
      }
    }

    throw new Error(`Unsupported value type: ${steps[0]}`);
  }
}
