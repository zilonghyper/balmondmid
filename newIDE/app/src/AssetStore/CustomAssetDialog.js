// @flow
import * as React from 'react';
import { Trans } from '@lingui/macro';
import Dialog from '../UI/Dialog';
import TextButton from '../UI/TextButton';
import { Column } from '../UI/Grid';
import SemiControlledTextField from '../UI/SemiControlledTextField';

type Props = {|
  onClose: () => void,
  onCustomAssetOpen: ({
    customAssetUrl: string,
  }) => Promise<void>,
|};

export const CustomAssetDialog = ({ onClose, onCustomAssetOpen }: Props) => {
  const [assetUrl, setassetUrl] = React.useState('');

  return (
    <Dialog
      maxWidth="sm"
      title={<Trans>Open Asset from URL</Trans>}
      open
      onRequestClose={onClose}
      actions={[
        <TextButton
          key="cancel"
          label={<Trans>Cancel</Trans>}
          onClick={onClose}
        />,
        <TextButton
          key="install"
          label={<Trans>Install</Trans>}
          onClick={() =>
            onCustomAssetOpen({
              customAssetUrl: assetUrl,
            })
          }
          disabled={!assetUrl}
        />,
      ]}
    >
      <Column noMargin expand>
        <SemiControlledTextField
          floatingLabelText={<Trans>Asset full URL</Trans>}
          fullWidth
          type="text"
          value={assetUrl}
          onChange={setassetUrl}
        />
      </Column>
    </Dialog>
  );
};
