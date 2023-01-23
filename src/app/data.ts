export default {
  id: 'form2',
  label: 'Form 3 with ungrouped fields',
  type: 'form',
  category: 'QC',
  description: '',
  renderInstructions: {
    numberedWidgets: true,
    theme: '',
  },
  nodes: [
    {
      id: 'GeneralScreen',
      label:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry',
      type: 'screen',
      nodes: [
        {
          id: 'textControl1',
          type: 'text',
          label:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed justo turpis, condimentum id volutpat non, pellentesque vitae metus.',
        },
        {
          id: 'BMI',
          type: 'field',
          isRequired: false,
          validations: [],
          dataType: 'Float',
          label: 'Bio-Mass Index',
          computedValue: {
            engine: 'jsonata',
            expression:
              '$subject.demographic.weight / ($subject.demographic.height * $subject.demographic.height)',
          },
          renderer: 'InputNumber',
          renderInstructions: {
            orientation: 'vertical',
          },
        },
        {
          id: 'GeneralQuestions',
          label: 'Group of questions #1',
          type: 'dataGroup',
          isRepeatable: false,
          description: 'Generation questions description',
          renderInstructions: {
            orientation: 'vertical',
          },
          nodes: [
            {
              id: 'generalFeeling',
              type: 'field',
              isRequired: false,
              validations: [],
              dataType: 'Int32',
              label: 'How are you feeling today?',
              description: 'Choose from the list',
              inputInstructions: 'Be honest',
              renderer: 'Dropdown',
              options: [
                {
                  id: '1',
                  label: 'I feel great',
                  value: '1',
                  activeWhenCondition: {
                    engine: 'jsonata',
                    expression: '$form.daysOfMedication > 5',
                  },
                },
                {
                  id: '2',
                  label: 'I have some mild discomfort or pain',
                  value: '2',
                },
                {
                  id: '3',
                  label: 'I feel moderate discomfort or pain',
                  value: '3',
                },
                {
                  id: '4',
                  label: 'I feel severe discomfort or pain',
                  value: '4',
                },
                {
                  id: '5',
                  label: 'I am in extreme pain or distress',
                  value: '5',
                },
              ],
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              id: 'symptoms',
              type: 'field',
              isRequired: true,
              requiredMessage: 'Can not be empty',
              options: [
                {
                  id: '1',
                  label: 'Weakness',
                  value: '1',
                },
                {
                  id: '2',
                  label: 'Dizziness',
                  value: '2',
                },
                {
                  id: '3',
                  label: 'Muscle aches and pains',
                  value: '3',
                },
                {
                  id: '4',
                  label: 'Fever',
                  value: '4',
                },
                {
                  id: '5',
                  label: 'Sweating',
                  value: '5',
                },
              ],
              validations: [],
              dataType: 'StringArray',
              label: 'Which symptoms are you experiencing?',
              description:
                'Be honest because your answer is important for the final results',
              inputInstructions: 'Select from the list',
              activeWhenCondition: {
                engine: 'jsonata',
                expression:
                  '$form.generalFeeling in [$form.generalFeeling.codelist.3, $form.generalFeeling.codelist.4, $form.generalFeeling.codelist.5]',
              },
              renderer: 'Dropdown',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              id: 'woundLength',
              type: 'field',
              isRequired: false,
              validations: [
                {
                  type: 'NumberRange',
                  message: 'Must be between 20 and 200',
                  behaviour: 'error',
                  min: 20,
                  max: 2000,
                },
              ],
              dataType: 'Float',
              label: 'What is the wound length?',
              inputInstructions:
                'This is needed for the special coefficient calculation',
              renderer: 'InputNumber',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              id: 'previousMedication',
              type: 'field',
              isRequired: false,
              validations: [
                {
                  type: 'StringLength',
                  message: 'Name length must be between 3 and 30',
                  behaviour: 'error',
                  min: 3,
                  max: 30,
                },
              ],
              dataType: 'String',
              label: 'What medication were you taking during your treatment?',
              activeWhenCondition: {
                engine: 'jsonata',
                expression: '$form.startOfMedicationDate != null',
              },
              renderer: 'SingleLine',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              formatMessage: 'The value must follow the format',
              id: 'lastDoseDateTime',
              type: 'field',
              isRequired: false,
              validations: [
                {
                  type: 'DateRange',
                  message: 'Only past date value is allowed',
                  behaviour: 'error',
                  allowFuture: false,
                  allowPast: true,
                },
                {
                  type: 'Expression',
                  message: "Can't be later than start of medication date",
                  behaviour: 'error',
                  expression: {
                    engine: 'jsonata',
                    expression: '$value <= $form.startOfMedicationDate',
                  },
                },
              ],
              dataType: 'DateTime',
              label: 'When and what time did you take the last pill',
              inputInstructions:
                'This value will be used to the form outcome calculation',
              activeWhenCondition: {
                engine: 'jsonata',
                expression: '$form.startOfMedicationDate != null',
              },
              renderer: 'DateTimeField',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              id: 'startOfMedicationDate',
              type: 'field',
              isRequired: false,
              validations: [
                {
                  type: 'DateRange',
                  message: 'Only past date value allowed',
                  behaviour: 'error',
                  allowFuture: false,
                  allowPast: true,
                },
              ],
              dataType: 'Date',
              label: 'When did you start taking the medication?',
              renderer: 'DateField',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              id: 'daysOfMedication',
              type: 'field',
              isRequired: false,
              validations: [],
              dataType: 'Int32',
              label: 'How many days did the treatment last?',
              computedValue: {
                engine: 'jsonata',
                expression:
                  '$floor(($toMillis($now()) - $toMillis($form.startOfMedication)) / 86400000)',
              },
              renderer: 'InputNumber',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              requiredMessage:
                'Can not be empty. Experimental expression syntax here. Instead of a codelist value - we store a reference to it',
              options: [
                {
                  id: '1',
                  label: 'Yes',
                  value: 'true',
                },
                {
                  id: '2',
                  label: 'No',
                  value: 'false',
                },
              ],
              id: 'doYouFeelBetter',
              type: 'field',
              isRequired: true,
              validations: [],
              dataType: 'String',
              label: 'Do you feel better now?',
              renderer: 'Dropdown',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              formatMessage: 'Date format must follow the format',
              requiredMessage: 'Can not be empty',
              id: 'timeOfWakeUp',
              type: 'field',
              isRequired: true,
              validations: [],
              dataType: 'Time',
              label: 'At what time did you wake up today?',
              renderer: 'TimeField',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'OptionalScreen',
      label: null,
      type: 'screen',
      nodes: [
        {
          id: 'textControl2',
          type: 'text',
          label: 'Suspendisse eget risus vitae augue consectetur commodo',
        },
        {
          id: 'FemaleQuestions',
          label: 'Group of questions #2',
          type: 'dataGroup',
          isRepeatable: true,
          description: 'Female Questions description',
          activeWhenCondition: {
            engine: 'jsonata',
            expression: "$subject.demographic.gender == 'female'",
          },
          nodes: [
            {
              requiredMessage: 'Please answer this question',
              id: 'areYouPregnant',
              type: 'field',
              isRequired: true,
              validations: [],
              dataType: 'Boolean',
              label: 'Are you pregnant now?',
              description:
                'This is an important question that may affect something',
              inputInstructions: 'Are you pregnant now?',
              renderer: 'Checkbox',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
            {
              id: 'whatWeekOfPregnancy',
              type: 'field',
              isRequired: false,
              validations: [
                {
                  type: 'NumberRange',
                  message: 'Must be between 1 and 45',
                  behaviour: 'error',
                  min: 1,
                  max: 45,
                },
              ],
              dataType: 'Int32',
              label: 'On what week of pregnancy you currently are?',
              description: 'Just wondering',
              inputInstructions: 'What week of pregnancy?',
              renderer: 'InputNumber',
              renderInstructions: {
                orientation: 'vertical',
              },
            },
          ],
          renderInstructions: {
            orientation: 'vertical',
          },
        },
      ],
    },
  ],
};
