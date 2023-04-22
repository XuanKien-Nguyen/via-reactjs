import React from 'react';
import { Collapse } from 'antd';
const { Panel } = Collapse;

const QandALayout = () => {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  return (
    <section id="QandA-layout">
      <div className='QandA-container'>
        <div className='QandA-title'><h2>Câu hỏi thường gặp?</h2></div>
        <div className='QandA-content'>
          <Collapse accordion bordered={false} style={{backgroundColor: 'white'}}>
            <Panel header="This is panel header 1" key="1">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 2" key="2">
              <p>{text}</p>
            </Panel>
            <Panel header="This is panel header 3" key="3">
              <p>{text}</p>
            </Panel>
          </Collapse>
        </div>
      </div>
    </section>
  );
};
export default QandALayout;
