import { useState, useEffect } from 'react';
import Joyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';

const OnboardingTour = ({ run, onComplete }) => {
  const [validSteps, setValidSteps] = useState([]);

  const allSteps = [
    {
      target: '.conversation-area',
      content: 'This is where you paste conversations and get AI-suggested replies.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.reply-section',
      content: 'The app recommends what to send based on conversation analysis, interest level, and ghosting risk.',
      disableBeacon: true,
      placement: 'top',
    },
    {
      target: '.user-settings-button',
      content: 'Your profile helps Replai learn how you talk, so replies sound like you — not AI.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.credits-display',
      content: 'Each reply uses credits. Use them where the conversation really matters.',
      disableBeacon: true,
      placement: 'bottom',
    },
    {
      target: 'body',
      content: "You're ready. You can revisit this tour anytime from Settings.",
      disableBeacon: true,
      placement: 'center',
    },
  ];

  // Filter steps to only include those with valid DOM targets
  useEffect(() => {
    if (run) {
      const checkSteps = () => {
        const valid = allSteps.filter((step) => {
          // 'body' is always present
          if (step.target === 'body') return true;
          // Check if target exists in DOM
          const element = document.querySelector(step.target);
          return element !== null;
        });
        setValidSteps(valid);
      };

      // Wait a moment for DOM to stabilize, then check
      const timer = setTimeout(checkSteps, 100);
      return () => clearTimeout(timer);
    }
  }, [run]);

  const handleJoyrideCallback = (data) => {
    const { status, action, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    // Handle errors gracefully - skip to next step or finish
    if (type === EVENTS.TARGET_NOT_FOUND) {
      console.warn('Tour target not found, skipping step');
      return;
    }

    if (type === EVENTS.ERROR) {
      console.warn('Tour error occurred, finishing tour');
      onComplete();
      return;
    }

    if (finishedStatuses.includes(status)) {
      onComplete();
    }
  };

  // Don't render tour if no valid steps or not running
  if (!run || validSteps.length === 0) {
    return null;
  }

  return (
    <Joyride
      steps={validSteps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      disableCloseOnEsc={false}
      spotlightClicks={false}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: '#3b82f6', // Blue accent (not red)
          textColor: '#1f2937',
          backgroundColor: '#ffffff',
          overlayColor: 'rgba(0, 0, 0, 0.5)',
          arrowColor: '#ffffff',
          zIndex: 10000,
        },
        tooltip: {
          borderRadius: '12px',
          padding: '20px',
          fontSize: '15px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        },
        tooltipContent: {
          padding: '8px 0',
          lineHeight: '1.6',
        },
        buttonNext: {
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 500,
        },
        buttonBack: {
          color: '#6b7280',
          marginRight: '8px',
        },
        buttonSkip: {
          color: '#6b7280',
          fontSize: '14px',
        },
        spotlight: {
          borderRadius: '8px',
        },
      }}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip tour',
      }}
      floaterProps={{
        disableAnimation: false,
        styles: {
          arrow: {
            length: 8,
            spread: 12,
          },
        },
      }}
    />
  );
};

export default OnboardingTour;
