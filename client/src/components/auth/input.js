export const renderInput = field => (
  <div>
    <input {...field.input} className='form-control'
      type={field.type} />
    {field.meta.error && <span className='error'>{field.meta.error}</span>}
  </div>
);
