import { useState, useEffect, useCallback } from 'react';

import { format } from 'date-fns';

import Type from '../../utils/Type';

import Input from './Input';
import Select from './Select';
import Bool from './Bool';
import Calendar from './Calendar';
import Relation from './Relation';
import Json from './Json';

import Panel from '../../utils/Panel';

export default function Field({
  label,
  type,
  value,
  onChange,
  handleSubmit,
  onClose,
  validator,
  triggerValidation,
  setTriggerValidation,
  validateOnBlur = true,
  config = {
    required: false,
    inline: false,
    preventSpaces: false,
    options: [],
    tableId: '',
  },
  children,
}) {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');

  let displayComponent = null;
  let editComponent = null;

  const handleValidation = useCallback(
    (val) => {
      if (validator) {
        const errorMessage = validator(val);
        if (errorMessage) {
          setError(errorMessage);
          return false;
        }
      }
      setError('');
      return true;
    },
    [validator]
  );

  useEffect(() => {
    if (triggerValidation) {
      console.log('validating due to external action');
      handleValidation(value);
      setTriggerValidation(false);
    }
  }, [triggerValidation, value, handleValidation, setTriggerValidation]);

  switch (type) {
    case 'text':
    case 'number':
    case 'password':
    case 'email':
    case 'url':
      displayComponent = (
        <span>{type === 'password' ? '*'.repeat(value.length) : value}</span>
      );
      editComponent = (
        <Input
          type={type}
          config={config}
          value={value}
          onChange={onChange}
          handleSubmit={handleSubmit}
          handleValidation={handleValidation}
          validateOnBlur={validateOnBlur}
        />
      );
      break;
    case 'select':
      displayComponent = (
        <span className="content-display-select">
          {Array.isArray(value)
            ? value
                .join(', ')
                .split(', ')
                .map((selection) => (
                  <span key={selection} className="content-display-selection">
                    {selection}
                  </span>
                ))
            : value}
        </span>
      );
      editComponent = (
        <Select
          options={config.options}
          value={value}
          onChange={onChange}
          setEditing={setEditing}
          handleSubmit={handleSubmit}
          handleValidation={handleValidation}
          onClose={onClose}
        />
      );
      break;
    case 'date':
      displayComponent = <span>{value && format(value, 'PP')}</span>;
      editComponent = (
        <Calendar
          value={value}
          onChange={onChange}
          handleSubmit={handleSubmit}
          setEditing={setEditing}
          handleValidation={handleValidation}
        />
      );
      break;
    case 'relation':
      displayComponent = <span>{value}</span>;
      editComponent = (
        <Relation
          value={value}
          onChange={onChange}
          setEditing={setEditing}
          tableId={config.tableId}
        />
      );
      break;
    case 'json':
      displayComponent = <span>{JSON.stringify(value)}</span>;
      editComponent = (
        <Json value={value} onChange={onChange} onClose={onClose} />
      );
      break;
  }

  return (
    <div className="field-container" onClick={() => setEditing(true)}>
      <div
        className={`field ${config.inline === true && 'inline'} ${
          editing && 'editing'
        } ${!label && 'cell'}`}
      >
        <label className="field-label" htmlFor={label}>
          {label !== undefined && (
            <Type type={type} error={error.length}>
              {label}
            </Type>
          )}
          {config.required && <span className="required">*</span>}
        </label>
        <div className="content">
          {type === 'bool' ? (
            <Bool
              value={value}
              onChange={onChange}
              handleSubmit={handleSubmit}
            />
          ) : (
            editing && (
              <div className="content-edit">
                <Panel setIsOpen={setEditing} onClose={onClose}>
                  {editComponent}
                </Panel>
              </div>
            )
          )}
          {(!editing ||
            type === 'select' ||
            type === 'relation' ||
            type === 'date') && (
            <div className="content-display" onClick={() => setEditing(true)}>
              {displayComponent}
            </div>
          )}
        </div>
        {children}
      </div>
      {!!error.length && !config.inline && (
        <div className="field-error-message-container">
          <span className="field-error-message">{error}</span>
        </div>
      )}
    </div>
  );
}