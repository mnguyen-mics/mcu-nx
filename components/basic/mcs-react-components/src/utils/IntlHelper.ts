const isValidFormattedMessageProps = (object: any) => {
  return object && object.id && object.defaultMessage;
};

export { isValidFormattedMessageProps };

export interface AbstractMessages {
  [x: string]: string;
}
