package com.applya.backend.Security;

import com.applya.backend.Models.User;
import com.applya.backend.Models.User.AuthProvider;
import com.applya.backend.Repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    public OAuth2AuthenticationSuccessHandler(JwtTokenProvider tokenProvider, UserRepository userRepository) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = oauthToken.getPrincipal();
        String registrationId = oauthToken.getAuthorizedClientRegistrationId();

        User user = processOAuth2User(registrationId, oAuth2User);
        String token = tokenProvider.generateToken(user.getId(), user.getEmail());

        // Redirect to frontend with token
        String targetUrl = frontendUrl + "/oauth/callback?token=" + token;
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }

    private User processOAuth2User(String registrationId, OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        
        String email;
        String firstName;
        String lastName;
        String providerId;
        AuthProvider provider;

        if ("google".equals(registrationId)) {
            email = (String) attributes.get("email");
            firstName = (String) attributes.get("given_name");
            lastName = (String) attributes.get("family_name");
            providerId = (String) attributes.get("sub");
            provider = AuthProvider.GOOGLE;
        } else if ("facebook".equals(registrationId)) {
            email = (String) attributes.get("email");
            String name = (String) attributes.get("name");
            String[] nameParts = name != null ? name.split(" ", 2) : new String[]{"", ""};
            firstName = nameParts[0];
            lastName = nameParts.length > 1 ? nameParts[1] : "";
            providerId = (String) attributes.get("id");
            provider = AuthProvider.FACEBOOK;
        } else {
            throw new RuntimeException("Unsupported OAuth2 provider: " + registrationId);
        }

        // Check if user exists
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            // Update provider info if needed
            if (user.getAuthProvider() == AuthProvider.LOCAL) {
                user.setAuthProvider(provider);
                user.setProviderId(providerId);
                return userRepository.save(user);
            }
            return user;
        }

        // Create new user
        User newUser = new User(email, firstName, lastName, provider, providerId);
        return userRepository.save(newUser);
    }
}