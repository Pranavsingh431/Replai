import { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';

const OnboardingTour = ({ run, onComplete }) => {
  const steps = [
    {
      target: '.conversation-area',
      content: 'This is where you paste conversations and get AI-suggested replies.',
      disableBeacon: true,
      placement: 'center',
    },
    {
      target: '.reply-section',
      content: 'The app recommends what to send based on conversation analysis, interest level, and ghosting risk.',
      placement: 'top',
    },
    {
      target: '.user-settings-button',
      content: 'Your profile helps Replai learn how you talk, so replies sound like you — not AI.',
      placement: 'bottom',
    },
    {
      target: '.credits-display',
      content: 'Each reply uses credits. Use them where the conversation really matters.',
      placement: 'bottom',
    },
    {
      target: 'body',
      content: "You're ready. You can revisit this tour anytime from Settings.",
      placement: 'center',
    },
  ];

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
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
