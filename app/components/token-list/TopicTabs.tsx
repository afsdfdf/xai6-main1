"use client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/app/i18n/client"
import { RankTopic } from "@/app/types/token"

interface TopicTabsProps {
  topics: RankTopic[]
  activeTopicId: string
  onTopicChange: (topicId: string) => void
}

export default function TopicTabs({ 
  topics, 
  activeTopicId, 
  onTopicChange 
}: TopicTabsProps) {
  const { i18n } = useTranslation()
  const currentLang = i18n.language

  // 根据当前语言选择显示的主题名称
  const getTopicName = (topic: RankTopic) => {
    if (currentLang === 'zh') {
      return topic.name_zh
    }
    return topic.name_en
  }

  return (
    <div className="mb-5 overflow-x-auto pb-2">
      <div className="flex gap-2">
        {topics.map((topic) => (
          <Button
            key={topic.id}
            variant={activeTopicId === topic.id ? "default" : "outline"}
            size="sm"
            className={`text-xs ${
              activeTopicId === topic.id 
                ? "bg-blue-600 hover:bg-blue-700" 
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 border-none"
            }`}
            onClick={() => onTopicChange(topic.id)}
          >
            {getTopicName(topic)}
          </Button>
        ))}
      </div>
    </div>
  )
} 