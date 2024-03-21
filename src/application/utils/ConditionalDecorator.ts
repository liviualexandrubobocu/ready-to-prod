function ConditionalDecorator(
  condition: boolean,
  decorator: MethodDecorator,
): any {
  return (target, propertyKey, descriptor) => {
    if (condition) {
      decorator(target, propertyKey, descriptor);
    }
  };
}

export default ConditionalDecorator;
