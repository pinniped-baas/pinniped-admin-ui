export default function Checkbox({ checked, onChange }) {
  return (
    <div>
      <label className="custom-checkbox">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="checkmark"></span>
      </label>
    </div>
  );
}