import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQItem[];
  className?: string;
}

const FAQAccordion: React.FC<FAQAccordionProps> = ({
  faqs = [
    {
      question: "What is B2GTHR?",
      answer:
        "B2GTHR is an app designed to help you stay connected with loved ones by providing a quick snapshot of their well-being through a slider-based interface.",
    },
    {
      question: "How does the mood selection work?",
      answer:
        "The mood selection bar consists of 6 colors, each representing a distinct emotional state from utmost serenity to a critical state needing immediate attention.",
    },
    {
      question: "Is my mood data private?",
      answer:
        "Yes, you have full control over who can see your mood data through the Privacy settings.",
    },
  ],
  className = "",
}) => {
  return (
    <Accordion type="single" collapsible className={className}>
      {faqs.map((faq, index) => (
        <AccordionItem key={index} value={`item-${index}`}>
          <AccordionTrigger className="text-left">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent>{faq.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default FAQAccordion;
