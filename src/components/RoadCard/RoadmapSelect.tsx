import { httpGet } from '../../lib/http';
import { useEffect, useState } from 'preact/hooks';
import { pageProgressMessage } from '../../stores/page';
import type { UserProgressResponse } from '../HeroSection/FavoriteRoadmaps';
import { SelectionButton } from './SelectionButton';

type RoadmapSelectProps = {
  selectedRoadmaps: string[];
  setSelectedRoadmaps: (updatedRoadmaps: string[]) => void;
};

export function RoadmapSelect(props: RoadmapSelectProps) {
  const { selectedRoadmaps, setSelectedRoadmaps } = props;

  const [progressList, setProgressList] = useState<UserProgressResponse>();

  const fetchProgress = async () => {
    const { response, error } = await httpGet<UserProgressResponse>(
      `${import.meta.env.PUBLIC_API_URL}/v1-get-user-all-progress`
    );

    if (error || !response) {
      return;
    }

    setProgressList(response);
  };

  useEffect(() => {
    fetchProgress().finally(() => {
      pageProgressMessage.set('');
    });
  }, []);

  const canSelectMore = selectedRoadmaps.length < 4;

  return (
    <div className="flex flex-wrap gap-1">
      {progressList
        ?.filter((progress) => progress.resourceType === 'roadmap')
        .map((progress) => {
          const isSelected = selectedRoadmaps.includes(progress.resourceId);
          const canSelect = isSelected || canSelectMore;

          return (
            <SelectionButton
              text={progress.resourceTitle}
              isDisabled={!canSelect}
              isSelected={isSelected}
              onClick={() => {
                if (isSelected) {
                  setSelectedRoadmaps(
                    selectedRoadmaps.filter(
                      (roadmap) => roadmap !== progress.resourceId
                    )
                  );
                } else if (selectedRoadmaps.length < 4) {
                  setSelectedRoadmaps([
                    ...selectedRoadmaps,
                    progress.resourceId,
                  ]);
                }
              }}
            />
          );
        })}
    </div>
  );
}