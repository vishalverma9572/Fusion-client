import {
	Button,
	Flex,
	Tabs,
  Text
} from "@mantine/core";
import { CaretCircleLeft, CaretCircleRight } from "@phosphor-icons/react";
import { useState, useRef} from 'react';
import classes from '../styles/Dashboard.module.css';

const tabItems = [
	{ title: "Recent" },
	{ title: "Notifications" },
	{ title: "Announcements" },
	{ title: "Events" },
];

const RecentTabs = () => {
  const [activeTab, setActiveTab] = useState(String(1));
  const tabsListRef = useRef(null);
  const totalTabs = 4;

  const handlePrev = () => {
    if(activeTab==="0") return;
    setActiveTab(() => {
      const currentIndex = parseInt(activeTab);
      return String(currentIndex-1);
    });
    scrollTabs('prev');
  };

  const handleNext = () => {
    if(activeTab===String(totalTabs-1)) return;
    setActiveTab(() => {
      const currentIndex = parseInt(activeTab);
      return String(currentIndex+1);
    });
    scrollTabs('next');
  };

  const scrollTabs = (direction) => {
    if (tabsListRef.current) {
      const scrollAmount = 50;
      if (direction === 'next') {
        tabsListRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      } else {
        tabsListRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      }
    }
  };

	return (
		<>
			<Flex justify="flex-start" align="center" gap={{base:"0.5rem", md:"1rem"}} mt={{base:"1rem", md:"1.5rem"}} ml={{md: "lg"}}>
        <Button onClick={handlePrev} variant="default" p={0} style={{ border: "none" }}>
					<CaretCircleLeft className={classes.fusionCaretCircleIcon} weight="light" />
				</Button>

        <div className={classes.fusionTabsContainer} ref={tabsListRef}>
          <Tabs value={activeTab} onChange={setActiveTab} >
            <Tabs.List style={{ display: 'flex', flexWrap: 'nowrap' }}>
              {
                tabItems.map((item, index) => (
                  <Tabs.Tab value={`${index}`} key={index} className={activeTab===`${index}` ? classes.fusionActiveRecentTab : "" }>
                    <Text>
                      {item.title}
                    </Text>
                  </Tabs.Tab>
                ))
              }
            </Tabs.List>
          </Tabs>
        </div>

        <Button onClick={handleNext} variant="default" p={0} style={{ border: "none" }}>
					<CaretCircleRight className={classes.fusionCaretCircleIcon} weight="light" />
				</Button>
			</Flex>
		</>
	);
};

export default RecentTabs;
