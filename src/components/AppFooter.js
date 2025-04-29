import React from "react";
import { CFooter } from "@coreui/react";

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">UI based on </span>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer">
          CoreUI
        </a>
        <span className="ms-1"> &amp; </span>
        <a
          href="https://r3f.docs.pmnd.rs/getting-started/introduction"
          target="_blank"
          rel="noopener noreferrer"
        >
          React Three Fiber
        </a>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://ollama.com/" target="_blank" rel="noopener noreferrer">
          Ollama
        </a>
      </div>
    </CFooter>
  );
};

export default React.memo(AppFooter);
