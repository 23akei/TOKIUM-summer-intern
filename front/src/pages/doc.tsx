import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SWOpenAPI() {
  return (
    <>
      <SwaggerUI
        url="/openapi.yml"
      />
    </>
  );
}
