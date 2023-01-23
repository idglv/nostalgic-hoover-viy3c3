export enum ValueType {
  Selected = 'selected',
  Previous = 'previous',
  Other = 'other',
}

export interface ICondition {
  condition: string;
  operator: ConditionOperator;
  valueType: ValueType;
  value: string;
  isPrimitive?: boolean;
}

export enum Do {
  Show = 'show',
  Populate = 'populate',
  Warn = 'warn',
  Validate = 'validate',
  Disable = 'disable',
}

export interface IFormCondition {
  do: Do;
  target: string;
  conditions: ICondition[];
  logicOperator: LogicOperator;
}

export enum LogicOperator {
  All = 'and',
  Any = 'or',
}

export enum ConditionOperator {
  Equal = '=',
  NotEqual = '!=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',
  LessThan = '<',
  LessThanOrEqual = '<=',
}

export default class JSONataExpressionGenerator {
  private generateConditionExpression(condition: ICondition): string {
    const {
      condition: field,
      operator,
      valueType,
      value,
      isPrimitive,
    } = condition;

    let expression = `$currentForm.${field} `;

    //workaround
    if (isPrimitive) {
      expression += `${operator} ${value}`;
    } else {
      switch (valueType) {
        case ValueType.Selected:
          expression += `${operator} $currentForm.${field}_options_${value}`;
          break;
        case ValueType.Previous:
          expression += `${operator} $previousVisits.${field}_options_${value}`;
          break;
        default:
          expression += value;
          break;
      }
    }

    return expression;
  }

  generateExpression(formCondition: IFormCondition): string {
    const { conditions, logicOperator } = formCondition;
    let expression = '';

    if (conditions && conditions.length > 0) {
      const conditionExpressions = conditions.map((condition) =>
        this.generateConditionExpression(condition)
      );

      expression += conditionExpressions.join(` ${logicOperator} `);
    }

    return expression;
  }
}
