import React from 'react';
import { Transition } from 'react-transition-group';

export interface SlideProps {
  toShow: boolean;
  content: React.ReactNode;
  horizontal?: boolean;
}

class Slide extends React.Component<SlideProps> {
  render() {
    const duration = 120;

    const { toShow } = this.props;

    const defaultStyle = !this.props.horizontal
      ? {
          transition: `max-height ${duration}ms ease-in-out`,
          display: 'block',
          height: '100%',
          opacity: 0,
          textAlign: 'center',
        }
      : {
          transition: `max-width ${duration}ms ease-in-out`,
          width: 'auto',
          height: '100%',
          opacity: 0,
          textAlign: 'center',
          display: 'inline-block',
        };

    const transitionStyles: any /*React.CSSProperties*/ = !this.props.horizontal
      ? {
          entering: { maxHeight: '0px', opacity: 0 },
          entered: { maxHeight: '50px', opacity: 1 },
        }
      : {
          entering: { maxWidth: '0px', opacity: 0 },
          entered: { maxWidth: '120px', opacity: 1 }, // pas scalable
        };

    return (
      <Transition in={toShow} timeout={duration}>
        {(
          state: any, // it's not the redux state
        ) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {toShow && this.props.content}
          </div>
        )}
      </Transition>
    );
  }
}

export default Slide;
