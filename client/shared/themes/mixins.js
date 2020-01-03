const mixins = {
  clearfix: () =>
    `&:after {
    content: '';
    display: table;
    clear: both;
  `,
};

export default mixins;
