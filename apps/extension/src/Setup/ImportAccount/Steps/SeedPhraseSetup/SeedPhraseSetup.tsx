import { useEffect, useState } from "react";

import { ActionButton, Heading, Stack } from "@namada/components";
import { AccountAlias, Password } from "Setup/Common";
import { Form, HeaderContainer } from "Setup/Setup.components";
import { AccountDetails } from "Setup/types";
import { useNavigate } from "react-router-dom";
import { formatRouterPath } from "@namada/utils";
import { TopLevelRoute } from "App/types";
import { Footer } from "./SeedPhraseSetup.components";

type SeedPhraseSetupProps = {
  seedPhrase?: string[];
  accountCreationDetails?: AccountDetails;
  onConfirm: (accountCreationDetails: AccountDetails) => void;
  passwordRequired: boolean | undefined;
};

export const SeedPhraseSetup = (props: SeedPhraseSetupProps): JSX.Element => {
  const navigate = useNavigate();
  const { seedPhrase, accountCreationDetails, onConfirm, passwordRequired } =
    props;

  const [password, setPassword] = useState<string | undefined>();
  const [accountName, setAccountName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const seedPhraseLength = seedPhrase ? seedPhrase.length : 0;
  const notVerified = (passwordRequired && !password) || !accountName;

  useEffect(() => {
    if (seedPhraseLength === 0) {
      navigate(formatRouterPath([TopLevelRoute.AddAccount]));
      return;
    }
  }, []);

  const onSubmitForm = (e: React.FormEvent): void => {
    e.preventDefault();
    if (notVerified || isSubmitting) return;

    setIsSubmitting(true);
    const accountCreationDetailsToSubmit: AccountDetails = {
      ...accountCreationDetails,
      alias: accountName,
      password,
    };
    onConfirm(accountCreationDetailsToSubmit);
  };

  return (
    <>
      <HeaderContainer>
        <Heading uppercase level="h1" size="3xl">
          Set up your imported keys
        </Heading>
      </HeaderContainer>
      <Form onSubmit={onSubmitForm}>
        <Stack gap={5}>
          <AccountAlias value={accountName} onChange={setAccountName} />
          {passwordRequired && <Password onValidPassword={setPassword} />}
        </Stack>
        <Footer>
          <ActionButton disabled={notVerified}>Next</ActionButton>
        </Footer>
      </Form>
    </>
  );
};