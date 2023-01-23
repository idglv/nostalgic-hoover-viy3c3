import jsonata from 'jsonata';
import JSONataASTParser from './JSONataASTParser';
import JSONataExpressionGenerator, {
  Do,
  LogicOperator,
  ConditionOperator,
  ValueType,
} from './JSONataExpressionGenerator';

const parser = new JSONataASTParser();

const inExpressions = [
  '$currentForm.bmi < 5',
  '$currentForm.bmi < 5 and $currentForm.generalFeeling = $currentForm.generalFeeling_options_1',
  '$currentForm.generalFeeling != $currentForm.generalFeeling_options_1',
  '$currentForm.generalFeeling = $previousVisits.generalFeeling_options_2',
  '$currentForm.extent = $currentForm.extent_options_2 or $currentForm.generalFeeling != $previousVisits.generalFeeling_options_1',
  '$currentForm.extent = $currentForm.extent_options_1 and $currentForm.generalFeeling != $previousVisits.generalFeeling_options_1 and $currentForm.generalFeeling != $previousVisits.generalFeeling_options_1',
];

const asts = inExpressions.map((expression) => jsonata(expression).ast());
console.log(asts);
const generator = new JSONataExpressionGenerator();
const formConditions = asts.map(parser.parseAST.bind(parser));
const outExpressions = formConditions.map(
  generator.generateExpression.bind(generator)
);

console.log('inExpressions', inExpressions);
console.log('formConditions', formConditions);
console.log('outExpressions', outExpressions);

console.log(
  outExpressions.map((expression, i) => expression === inExpressions[i])
);

// const condition = {
//   condition: 'generalFeeling',
//   operator: ConditionOperator.NotEqual,
//   valueType: ValueType.Selected,
//   value: '1',
// };

// const formCondition = {
//   do: Do.Show,
//   target: 'generalFeeling',
//   conditions: [{ ...condition }],
//   logicOperator: LogicOperator.All,
// };

// const expressions = [
//   { ...formCondition },
//   {
//     ...formCondition,
//     ...{
//       conditions: [
//         {
//           ...condition,
//           operator: ConditionOperator.Equal,
//           valueType: ValueType.Previous,
//         },
//       ],
//     },
//   },
//   {
//     ...formCondition,
//     logicOperator: LogicOperator.Any,
//     ...{
//       conditions: [
//         {
//           condition: 'extent',
//           operator: ConditionOperator.Equal,
//           valueType: ValueType.Selected,
//           value: '2',
//         },
//         {
//           condition: 'generalFeeling',
//           operator: ConditionOperator.NotEqual,
//           valueType: ValueType.Previous,
//           value: '1',
//         },
//       ],
//     },
//   },
// ].map(generator.generateExpression.bind(generator));

// const answers = [
//   '$currentForm.generalFeeling != $currentForm.generalFeeling_options_1',
//   '$currentForm.generalFeeling = $previousVisits.generalFeeling_options_1',
//   '$currentForm.extent = $currentForm.extent_options_2 or $currentForm.generalFeeling != $previousVisits.generalFeeling_options_1',
// ];

// console.log(expressions.map((expression, i) => expression === answers[i]));
