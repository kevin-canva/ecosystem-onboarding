import { Button, Rows, Text, Title } from "@canva/app-ui-kit";
import * as styles from "styles/components.css";

export const DOCS_URL = "https://www.canva.dev/docs/apps/";

export const App = () => {

  return (
    <div className={styles.scrollContainer}>
    <Rows spacing="2u">
      <Rows spacing="1u">
        <Title>Hello world</Title>
        <Text>This is a paragraph of text.</Text>
      </Rows>
      <Button variant="primary">Click me</Button>
    </Rows>

    </div>
  );
};
