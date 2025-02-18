import React, { useRef } from 'react';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Input } from '../../jest/components';
import { useFieldState } from '../../src';

const ComponentUsingFieldState = ({ name }) => {
  const fieldState = useFieldState(name);

  const i = useRef(0);
  i.current = i.current + 1;

  return (
    <>
      <h5>Component using fieldState: {name}</h5>
      <span data-testid="renders">Rendered: {i.current}</span>
      <pre data-testid="state">
        <code>{JSON.stringify(fieldState, null, 2)}</code>
      </pre>
    </>
  );
};

const getState = state => {
  return JSON.stringify(state, null, 2);
};

// prettier-ignore
describe('useFieldState', () => {

  const validate = value => {
    return !value || value.length < 5
      ? 'Field must be at least five characters'
      : undefined;
  };

  it('should update state when user types', () => {
    const formApiRef = {};

    const { getByLabelText, queryAllByTestId } = render(
      <Form
        formApiRef={formApiRef}>
        <Input name="first" label="First Name" />
        <Input name="last" label="Last Name" />
        <ComponentUsingFieldState name="first" />
        <ComponentUsingFieldState name="last" />
      </Form>
    );

    const renders = queryAllByTestId('renders');
    const states = queryAllByTestId('state');

    expect(renders[0].textContent).toBe('Rendered: 2');
    expect(renders[1].textContent).toBe('Rendered: 2');

    const first = getByLabelText('First Name');
    const last = getByLabelText('Last Name');

    userEvent.type(first, 'J');

    expect(renders[0].textContent).toBe('Rendered: 4');
    expect(renders[1].textContent).toBe('Rendered: 2');
    expect(states[0].textContent).toBe(getState({
      value: 'J',
      maskedValue: 'J',
      touched: false,
      pristine: false,
      dirty: true,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: true,
      data: undefined
    }));
    expect(states[1].textContent).toBe(getState({
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    userEvent.type(first, 'oe');

    expect(renders[0].textContent).toBe('Rendered: 6');
    expect(renders[1].textContent).toBe('Rendered: 2');
    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: false,
      pristine: false,
      dirty: true,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: true,
      data: undefined
    }));
    expect(states[1].textContent).toBe(getState({
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    // NOTE: when user starts typing in this field it will blur first field and cause a re-render!
    userEvent.type(last, 'Puzz');

    expect(renders[0].textContent).toBe('Rendered: 7');
    expect(renders[1].textContent).toBe('Rendered: 7');
    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: true,
      pristine: false,
      dirty: true,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: true,
      data: undefined
    }));
    expect(states[1].textContent).toBe(getState({
      value: 'Puzz',
      maskedValue: 'Puzz',
      touched: false,
      pristine: false,
      dirty: true,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: true,
      data: undefined
    }));

  });

  it('should have correct state on initial load with initial values at field level', () => {
    const formApiRef = {};

    const { queryAllByTestId } = render(
      <Form
        formApiRef={formApiRef}>
        <Input name="first" label="First Name" initialValue="Joe" />
        <Input name="last" label="Last Name" initialValue="Puzzo"/>
        <ComponentUsingFieldState name="first" />
        <ComponentUsingFieldState name="last" />
      </Form>
    );

    const renders = queryAllByTestId('renders');
    const states = queryAllByTestId('state');

    expect(renders[0].textContent).toBe('Rendered: 2');
    expect(renders[1].textContent).toBe('Rendered: 2');

    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));
    expect(states[1].textContent).toBe(getState({
      value: 'Puzzo',
      maskedValue: 'Puzzo',
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

  });

  it('should have correct state on initial load with initial values at form level', () => {
    const formApiRef = {};
    const initialValues = {
      first: 'Joe', 
      last: 'Puzzo'
    };

    const { queryAllByTestId } = render(
      <Form
        initialValues={initialValues}
        formApiRef={formApiRef}>
        <Input name="first" label="First Name" validateOn="change" />
        <Input name="last" label="Last Name" />
        <ComponentUsingFieldState name="first" />
        <ComponentUsingFieldState name="last" />
      </Form>
    );

    const renders = queryAllByTestId('renders');
    const states = queryAllByTestId('state');

    expect(renders[0].textContent).toBe('Rendered: 2');
    expect(renders[1].textContent).toBe('Rendered: 2');

    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: false,
      pristine: true, 
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));
    expect(states[1].textContent).toBe(getState({
      value: 'Puzzo',
      maskedValue: 'Puzzo',
      touched: false,
      pristine: true, 
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

  });

  it('should correctly update state when user submits --> types --> submits with defaultBehavior', () => {
    const formApiRef = {};

    const { getByLabelText, queryAllByTestId, getByText } = render(
      <Form
        formApiRef={formApiRef}>
        <Input name="first" label="First Name" initialValue="Joe" validate={validate}/>
        <Input name="last" label="Last Name" validate={validate} required />
        <ComponentUsingFieldState name="first" />
        <ComponentUsingFieldState name="last" />
        <button type="submit">Submit</button>
      </Form>
    );

    const renders = queryAllByTestId('renders');
    const states = queryAllByTestId('state');
    const submit = getByText('Submit');

    expect(renders[0].textContent).toBe('Rendered: 2');
    expect(renders[1].textContent).toBe('Rendered: 2');

    const last = getByLabelText('Last Name');

    // Before submit -------------------------------------

    expect(renders[0].textContent).toBe('Rendered: 2');
    expect(renders[1].textContent).toBe('Rendered: 2');
    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));
    expect(states[1].textContent).toBe(getState({
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    fireEvent.click(submit);

    // After submit -------------------------------------

    expect(renders[0].textContent).toBe('Rendered: 3');
    expect(renders[1].textContent).toBe('Rendered: 3');

    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: true,
      error: 'Field must be at least five characters',
      pristine: true,
      dirty: false,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    expect(states[1].textContent).toBe(getState({
      touched: true,
      error: 'This field is required',
      pristine: true,
      dirty: false,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    userEvent.type(last, 'P');

    // After second field has some input -------------------------------------

    expect(renders[0].textContent).toBe('Rendered: 3');
    expect(renders[1].textContent).toBe('Rendered: 5');
    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: true,
      error: 'Field must be at least five characters',
      pristine: true,
      dirty: false,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    expect(states[1].textContent).toBe(getState({
      value: 'P',
      maskedValue: 'P',
      touched: true,
      error: 'This field is required', // Note because by default only validate on blur
      pristine: false,
      dirty: true,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: true,
      data: undefined
    }));

    fireEvent.click(submit);

    // After SECOND submit -------------------------------------

    expect(renders[0].textContent).toBe('Rendered: 4');
    expect(renders[1].textContent).toBe('Rendered: 6');
    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: true,
      error: 'Field must be at least five characters',
      pristine: true,
      dirty: false,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    expect(states[1].textContent).toBe(getState({
      value: 'P',
      maskedValue: 'P',
      touched: true,
      error: 'Field must be at least five characters',
      pristine: false,
      dirty: true,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: true,
      data: undefined
    }));

  });

  it('should correctly update state when user submits --> types --> submits with validateOn="change" passed to inputs', () => {
    const formApiRef = {};

    const { getByLabelText, queryAllByTestId, getByText } = render(
      <Form
        formApiRef={formApiRef}>
        <Input name="first" label="First Name" validateOn="change" initialValue="Joe" validate={validate}/>
        <Input name="last" label="Last Name" validateOn="change" validate={validate} required/>
        <ComponentUsingFieldState name="first" />
        <ComponentUsingFieldState name="last" />
        <button type="submit">Submit</button>
      </Form>
    );

    const renders = queryAllByTestId('renders');
    const states = queryAllByTestId('state');
    const submit = getByText('Submit');

    expect(renders[0].textContent).toBe('Rendered: 2');
    expect(renders[1].textContent).toBe('Rendered: 2');

    const last = getByLabelText('Last Name');

    // Before submit -------------------------------------

    expect(renders[0].textContent).toBe('Rendered: 2');
    expect(renders[1].textContent).toBe('Rendered: 2');
    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));
    expect(states[1].textContent).toBe(getState({
      touched: false,
      pristine: true,
      dirty: false,
      valid: true, 
      invalid: false,
      showError: false,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    fireEvent.click(submit);

    // After submit -------------------------------------

    expect(renders[0].textContent).toBe('Rendered: 3');
    expect(renders[1].textContent).toBe('Rendered: 3');

    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: true,
      error: 'Field must be at least five characters',
      pristine: true,
      dirty: false,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    expect(states[1].textContent).toBe(getState({
      touched: true,
      error: 'This field is required',
      pristine: true,
      dirty: false,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    userEvent.type(last, 'P');

    // After second field has some input -------------------------------------

    expect(renders[0].textContent).toBe('Rendered: 3');
    expect(renders[1].textContent).toBe('Rendered: 5');
    expect(states[0].textContent).toBe(getState({
      value: 'Joe',
      maskedValue: 'Joe',
      touched: true,
      error: 'Field must be at least five characters',
      pristine: true,
      dirty: false,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: false,
      data: undefined
    }));

    expect(states[1].textContent).toBe(getState({
      value: 'P',
      maskedValue: 'P',
      touched: true,
      error: 'Field must be at least five characters', // Changed because validateOnChange
      pristine: false,
      dirty: true,
      valid: false, 
      invalid: true,
      showError: true,
      validating: false,
      gathering: false,
      focused: true,
      data: undefined
    }));

  });

});
