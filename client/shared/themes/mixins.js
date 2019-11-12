const clearFix = () =>
  `&:after {
    content: '';
    display: table;
    clear: both;
  `;

export default clearFix;
