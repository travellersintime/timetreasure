package com.timetravellers.backend.validators;

import org.springframework.stereotype.Component;

@Component
public class EmailValidator {
    private static final String ALLOWED_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-._@";

    public boolean validate(String email) {
        // Step 1: E-mail needs to contain an @
        if (!email.contains("@")) {
            return false;
        }

        // Step 2: E-mail needs to contain only letters, digits, minus (-), dots, underscores (_) or 'at' (@) characters but NOT more than one 'at' (@).
        int atCount = 0;
        boolean wasSpecialCharacterBefore = false;

        for(int i = 0; i<email.length(); i++) {
            String charAtIndex = String.valueOf(email.charAt(i));
            // Contain only allowed characters
            if (!ALLOWED_CHARSET.contains(charAtIndex)) {
                return false;
            }
            else {
                if (email.charAt(i) == '@') {
                    atCount++;

                    // If more than one @, e-mail is not valid
                    if (atCount > 1) {
                        return false;
                    }
                }
                // If special character, do NOT allow for consecutives
                else if (isSpecialChar(email.charAt(i))) {
                    if (wasSpecialCharacterBefore) {
                        return false;
                    }
                    else {
                        wasSpecialCharacterBefore = true;
                    }
                }
                else {
                    // No special character. Alpha-numeric encountered.
                    wasSpecialCharacterBefore = false;
                }
            }
        }

        // Step 3: E-mail needs to contain a proper domain
        String[] splitEmail = email.split("@");

        // Step 3.1: First E-mail part (before @) does not need to start or end with a special character
        if (isSpecialChar(splitEmail[0].charAt(0)) || isSpecialChar(splitEmail[0].charAt(splitEmail[0].length()-1))) {
            return false;
        }


        // Step 3.2: Domain needs to contain at least one dot
        if (!splitEmail[1].contains(".")) {
            return false;
        }

        // Step 3.3: Splitting all the subdomains of the domain. Subdomains do not need to start with a special character or have a length <= 1.
        String[] splitDomain = splitEmail[1].split(".");

        for(String subdomain: splitDomain) {
            if (subdomain.length() <= 1) {
                return false;
            }

            if (isSpecialChar(subdomain.charAt(0)) || isSpecialChar(subdomain.charAt(subdomain.length()-1))) {
                return false;
            }
        }

        return true;
    }

    private boolean isSpecialChar(char c) {
        return (c < 'A' || c > 'Z') && (c < 'a' || c > 'Z');
    }
}
